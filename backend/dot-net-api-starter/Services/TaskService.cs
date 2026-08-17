using Capsitech;
using Microsoft.AspNetCore.Mvc.ApiExplorer;
using Microsoft.Extensions.Options;
using MongoDB.Driver;
using Projects.Config.Db;
using Projects.Models;

namespace Projects.Services
{
    public class TaskService
    {
        private readonly IMongoCollection<Tasks> _tasksCollection;

        public TaskService(IOptions<DbSettings> databaseSettings)
        {
            var mongoClient = new MongoClient(databaseSettings.Value.ConnectionString);
            var mongoDatabase = mongoClient.GetDatabase(databaseSettings.Value.DatabaseName);
            _tasksCollection = mongoDatabase.GetCollection<Tasks>(databaseSettings.Value.TasksCollectionName);
        }

        public async Task<ApiResponse<List<Tasks>>> GetAllTasksAsync(string projectId)
        {
            var response = new ApiResponse<List<Tasks>>();
            var tasks = await _tasksCollection.Find(ta => ta.ProjectId == projectId).ToListAsync();
            response.Result = tasks;
            return response;
        }

        public async Task<ApiResponse<string>> CreateTaskAsync(Tasks task)
        {
            var response = new ApiResponse<string>();

            await _tasksCollection.InsertOneAsync(task);

            response.Result = "Task " + task.Name + " created successfully.";
            return response;
        }

        public async Task<ApiResponse<string>> UpdateStatusAsync(string taskId)
        {
            var response = new ApiResponse<string>();

            var task = await _tasksCollection.Find(ta => ta.Id == taskId).FirstOrDefaultAsync();

            var filter = Builders<Tasks>.Filter.Eq(ta => ta.Id, taskId);
            var update = Builders<Tasks>.Update.Set(ta => ta.Status, !task.Status);

            await _tasksCollection.UpdateOneAsync(filter, update);

            response.Result = "Task updated successfully";
            return response;
        }

        public async Task<ApiResponse<string>> UpdateNameAsync(string taskId, string newName)
        {
            var response = new ApiResponse<string>();

            var filter = Builders<Tasks>.Filter.Eq(ta => ta.Id, taskId);
            var update = Builders<Tasks>.Update.Set(ta => ta.Name, newName);

            await _tasksCollection.UpdateOneAsync(filter, update);

            response.Result = "Task updated";
            return response;
        }

        public async Task<ApiResponse<string>> DeleteTaskAsync(string taskId)
        {
            var response = new ApiResponse<string>();

            await _tasksCollection.DeleteOneAsync(t => t.Id == taskId);

            response.Result = "Task deleted successfully";
            return response;
        }

        public async Task<ApiResponse<string>> DeleteAllTaskAsync(string projectId)
        {
            var response = new ApiResponse<string>();

            await _tasksCollection.DeleteManyAsync(t => t.ProjectId == projectId);

            response.Result = "Task deleted successfully";
            return response;
        }
    }
}
