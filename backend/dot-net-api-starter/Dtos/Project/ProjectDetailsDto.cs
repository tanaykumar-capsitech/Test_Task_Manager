using MongoDB.Bson.Serialization.Attributes;
using Projects.Models;

namespace Projects.Dtos.Project
{
    public class ProjectDetailsDto
    {
        [BsonId]
        [BsonRepresentation(MongoDB.Bson.BsonType.ObjectId)]
        public string? Id { get; set; }
        [BsonRepresentation(MongoDB.Bson.BsonType.ObjectId)]
        public string UserId { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public string Status { get; set; }
        public List<Tasks> AllTasks { get; set; }
    }
}
