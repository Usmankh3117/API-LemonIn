using System.ComponentModel.DataAnnotations;

namespace LimLink_API.Model
{
    public class LoginModel
    {
        [Required]
        public string Email { get; set; }

        [Required]
        public string Password { get; set; }
    }
}
