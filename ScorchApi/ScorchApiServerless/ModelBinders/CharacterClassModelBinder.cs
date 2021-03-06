﻿using System.IO;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc.ModelBinding;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using ScorchApiServerless.Models.DnDClasses;

namespace ScorchApiServerless.ModelBinders
{
    public class CharacterClassModelBinder : IModelBinder
    {
        public Task BindModelAsync(ModelBindingContext bindingContext)
        {
            var content = bindingContext.HttpContext.Request;
            string json = GetBody(content);
            dynamic obj = JObject.Parse(json);

            bindingContext.Result = GetCharacterClass(obj, json);
            return Task.CompletedTask;
        }

        private ModelBindingResult GetCharacterClass(dynamic character, string json)
        {
            if (character.Name == null)
            {
                return ModelBindingResult.Success(JsonConvert.DeserializeObject(json, typeof(BaseClass)));
            }

            var itemTypes = new[] { typeof(Fighter), typeof(Warlock), typeof(Bard), typeof(Paladin), typeof(Ranger) };
            var matchedType = itemTypes.Single(x => x.Name == character.Name.ToString());
            if (matchedType != null)
            {
                return ModelBindingResult.Success(JsonConvert.DeserializeObject(json, matchedType));
            }

            return ModelBindingResult.Success(JsonConvert.DeserializeObject(json, typeof(BaseClass)));

        }

        private string GetBody(HttpRequest request)
        {
            var inputStream = request.Body;

            using (var reader = new StreamReader(inputStream))
            {
                var body = reader.ReadToEnd();
                return body;
            }
        }
    }
}
