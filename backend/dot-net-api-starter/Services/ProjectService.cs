using Capsitech;
using Microsoft.Extensions.Options;
using MongoDB.Driver;
using Projects.Config.Db;
using Projects.Dtos.Project;
using Projects.Models;
using System.IO.Pipelines;

namespace Projects.Services
{
    public class ProjectService
    {
        private readonly IMongoCollection<ProjectSchema> pSchema;
        private readonly IMongoCollection<Tasks> tSchema;
        private readonly TaskService taskService;

        public ProjectService(IOptions<DbSettings> dbSettings, TaskService taskService)
        {
            MongoClient mongo = new MongoClient(dbSettings.Value.ConnectionString);
            pSchema = mongo.GetDatabase(dbSettings.Value.DatabaseName).GetCollection<ProjectSchema>(dbSettings.Value.ProjectsCollectionName);
            tSchema = mongo.GetDatabase(dbSettings.Value.DatabaseName).GetCollection<Tasks>(dbSettings.Value.TasksCollectionName);
            this.taskService = taskService;
        }

        public async Task<ApiResponse<List<ProjectSchema>>> GetAllProjects(string userId)
        {
            ApiResponse<List<ProjectSchema>> response = new();
            var projects = await pSchema.Find(po => po.UserId == userId).ToListAsync();

            response.Result = projects;

            return response;
        }

        public async Task<ApiResponse<ProjectDetailsDto>> GetProjectDetails(string projectId, int pageNo, int month)
        {
            ApiResponse<ProjectDetailsDto> response = new();

            var result = await pSchema.Aggregate()
                .Match(pr => pr.Id == projectId)
                .Lookup<ProjectSchema, Tasks, ProjectDetailsDto>(
                    foreignCollection: tSchema, 
                    localField: p => p.Id,
                    foreignField:t => t.ProjectId,
                    @as: dto => dto.AllTasks
                )
                .FirstOrDefaultAsync();


            if (result != null) 
            { 
                result.AllTasks = result.AllTasks
                    .Where(ta => ta.CreationTime.Month == month)
                    .OrderByDescending(t => t.CreationTime)
                    .Skip((pageNo - 1) * 5)
                    .Take(5)
                    .ToList(); 
            }

            response.Result = result;

            return response;
        }

        public async Task<ApiResponse<string>> CreateProject(ProjectSchema project)
        {
            ApiResponse<string> response = new();

            var rsult = await pSchema.Find(pr => pr.Name == project.Name).FirstOrDefaultAsync();
            if (rsult != null) 
            {
                response.Message = "Project Exist";
                return response;
            }

            await pSchema.InsertOneAsync(project);
            response.Status = true;
            response.Message = "Project Created";

            return response;
        }

        public async Task<ApiResponse<string>> UpdateProject(UpdateProjectDto updated)
        {
            ApiResponse<string> response = new(); 

            var updates = new List<UpdateDefinition<ProjectSchema>>();
            
            var existingProject = await pSchema.Find(pr => pr.Id == updated.Id).FirstOrDefaultAsync(); 
            var existingName = await pSchema.Find(pr => pr.Name == updated.Name).FirstOrDefaultAsync();
            
            if (existingProject == null) 
            { 
                response.Message = "Project not found"; 
                return response; 
            }

            if (!string.IsNullOrWhiteSpace(updated.Name) 
                && existingName != null 
                && existingName.UserId == existingProject.UserId
                && existingName.Id != updated.Id
                ) 
            { 
                response.Message = "Project already exists"; 
                return response;    
            }

            if (!string.IsNullOrEmpty(updated.Name))
            {
                updates.Add(Builders<ProjectSchema>.Update.Set(pr => pr.Name, updated.Name));
            }
            if (!string.IsNullOrEmpty(updated.Description))
            {
                updates.Add(Builders<ProjectSchema>.Update.Set(pr => pr.Description, updated.Description));
            }
            if (!string.IsNullOrEmpty(updated.Status))
            {
                updates.Add(Builders<ProjectSchema>.Update.Set(pr => pr.Status, updated.Status));
            }
            
            if (updates.Count == 0) 
            { 
                response.Message = "Nothing to update"; 
                return response; 
            }

            var filter = Builders<ProjectSchema>.Filter.Eq(pr => pr.Id, updated.Id); 
            var update = Builders<ProjectSchema>.Update.Combine(updates); 
            
            await pSchema.UpdateOneAsync(filter, update); 
            
            response.Status = true; 
            response.Message = "Project details updated"; 
            return response;
        }


        public async Task<ApiResponse<string>> DeleteProject(string id)
        {
            ApiResponse<string> response = new();

            await pSchema.DeleteOneAsync(pr => pr.Id == id);
            await taskService.DeleteAllTaskAsync(id);

            response.Status = true;
            response.Message = "Project deleted";

            return response;
        }
    }
}
