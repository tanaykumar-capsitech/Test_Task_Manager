using MongoDB.Bson.Serialization.Attributes;

namespace Projects.Models
{
    public class Tasks
    {
        [BsonId]
        [BsonRepresentation(MongoDB.Bson.BsonType.ObjectId)]
        public string? Id { get; set; }
        [BsonRepresentation(MongoDB.Bson.BsonType.ObjectId)]
        public string ProjectId { get; set; }
        public string Name { get; set; }
        public bool Status { get; set; }
        public DateTime CreationTime { get; set; } = DateTime.UtcNow;
    }
}
