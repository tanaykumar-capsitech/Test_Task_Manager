using Capsitech;
using Capsitech.Extensions;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Projects.Dtos.Task;
using Projects.Models;
using Projects.Services;
using System.Security.Claims;

namespace Projects.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize(AuthenticationSchemes = "Bearer")]
    public class TaskController : ControllerBase
    {
        private readonly TaskService _taskService;

        public TaskController(TaskService taskService)
        {
            _taskService = taskService;
        }

        [HttpGet("GetAllTasks")]
        public async Task<ApiResponse<List<Tasks>>> GetAllTasks(string id)
        {
            var response = await _taskService.GetAllTasksAsync(id);
            return response;
        }

        [HttpPost("CreateTask")]
        public async Task<ApiResponse<string>> CreateTask([FromBody] AddTaskDto task)
        {
            Tasks newTask= new();

            newTask.Name = task.Name;
            newTask.ProjectId = task.ProjectId;
            newTask.Status = false;
            newTask.CreationTime = DateTime.UtcNow;

            var response = await _taskService.CreateTaskAsync(newTask);
            return response;
        }

        [HttpPost("UpdateStatus")]
        public async Task<ApiResponse<string>> UpdateTaskStatus([FromQuery] string id)
        {
            var response = await _taskService.UpdateStatusAsync(id);
            return response;
        }

        [HttpPost("UpdateName")]
        public async Task<ApiResponse<string>> UpdateTaskName([FromQuery] string id, [FromQuery] string newName)
        {
            var response = await _taskService.UpdateNameAsync(id, newName);
            return response;
        }

        [HttpPost("DeleteTask")]
        public async Task<ApiResponse<string>> DeleteTask([FromQuery] string id)
        {
            var response = await _taskService.DeleteTaskAsync(id);
            return response;
        }
    }
}
