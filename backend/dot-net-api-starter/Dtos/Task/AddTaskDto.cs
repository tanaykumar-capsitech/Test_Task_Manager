using MongoDB.Bson.Serialization.Attributes;

namespace Projects.Dtos.Task
{
    public class AddTaskDto
    {
        [BsonRepresentation(MongoDB.Bson.BsonType.ObjectId)]
        public string ProjectId { get; set; }
        public string Name { get; set; }
    }
}
