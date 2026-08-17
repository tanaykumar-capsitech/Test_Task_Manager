using MongoDB.Bson.Serialization.Attributes;

namespace Projects.Dtos.Project
{
    public class UpdateProjectDto
    {
        [BsonRepresentation(MongoDB.Bson.BsonType.ObjectId)]
        public string Id { get; set; }
        public string? Name { get; set; }
        public string? Description { get; set; }
        public string? Status { get; set; }
    }
}
