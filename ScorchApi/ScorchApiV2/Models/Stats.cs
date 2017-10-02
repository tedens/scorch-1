﻿using Amazon.DynamoDBv2.DocumentModel;

namespace ScorchApiV2.Models
{
    public class Stats
    {
        public int Strength     { get; set; }
        public int Dexterity    { get; set; }
        public int Constitution { get; set; }
        public int Intelligence { get; set; }
        public int Wisdom       { get; set; }
        public int Charisma     { get; set; }

        public Stats() { }

        public Stats(DynamoDBEntry entry)
        {
            var doc         = entry.AsDocument();
            Strength        = doc["Strength"].AsInt();
            Dexterity       = doc["Dexterity"].AsInt();
            Constitution    = doc["Constitution"].AsInt();
            Intelligence    = doc["Intelligence"].AsInt();
            Wisdom          = doc["Wisdom"].AsInt();
            Charisma        = doc["Charisma"].AsInt();
        }

        public Document ToDocument()
        {
            var doc = new Document
            {
                ["Strength"]        = Strength,
                ["Dexterity"]       = Dexterity,
                ["Constitution"]    = Constitution,
                ["Intelligence"]    = Intelligence,
                ["Wisdom"]          = Wisdom,
                ["Charisma"]        = Charisma
            };

            return doc;
        }
    }
}