using Capsitech;
using Capsitech.Data.MongoDB;
using Capsitech.Extensions;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Projects.Common;
using Projects.Dtos.Project;
using Projects.Models;
using Projects.Services;

namespace Projects.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize(AuthenticationSchemes = "Bearer")]
    public class ProjectController : ControllerBase
    {
        private readonly ProjectService projectService;
        
        public ProjectController(ProjectService projectService)
        {
            this.projectService = projectService;
        }

        [HttpGet("GetAllProjects")]
        public async Task<ApiResponse<List<ProjectSchema>>> GetAllProjects()
        {
            string id = User.GetUserId();            
            return await projectService.GetAllProjects(id);
        }

        [HttpGet("GetProjectDetails")]
        public async Task<ApiResponse<ProjectDetailsDto>> GetProjectDetails(string projectId, int pageNo, int month)
        {
            if (string.IsNullOrEmpty(projectId))
            {
                ApiResponse<ProjectDetailsDto> response = new();

                response.Message = "No project id";
                return response;
            }
            return await projectService.GetProjectDetails(projectId, pageNo, month);
        }


        [HttpPost("CreateProject")]
        public async Task<ApiResponse<string>> CreateProject(CreateProjectDto project)
        {
            if(string.IsNullOrEmpty(project.Name) || string.IsNullOrEmpty(project.Description) || string.IsNullOrEmpty(project.Status))
            {
                ApiResponse<string> response = new();

                response.Status = false;
                response.Message = "Enter all the fields";

                return response;
            }

            ProjectSchema newProjet = new();

            newProjet.Name = project.Name;
            newProjet.Description = project.Description;
            newProjet.UserId = User.GetUserId();
            newProjet.Status = project.Status;

            return await projectService.CreateProject(newProjet);
        }

        [HttpPost("UpdateProject")]
        public async Task<ApiResponse<string>> UpdateTask(UpdateProjectDto updated)
        {
            return await projectService.UpdateProject(updated);
        }

        [HttpPost("DeleteProject")]
        public async Task<ApiResponse<string>> DeleteProject(string projectId)
        {
            return await projectService.DeleteProject(projectId);
        }
    }
}
