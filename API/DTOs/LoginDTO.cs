using System;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;

namespace API.DTOs;

public class LoginDTO
{

    [Required]
    [EmailAddress]
    public string email { get; set; } = "";

    [Required]
    [MinLength(4)]
    [PasswordPropertyText]
    public string password { get; set; } = "";


}
