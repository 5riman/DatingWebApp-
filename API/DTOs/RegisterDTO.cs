using System;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;

namespace API.DTOs;

public class RegisterDTO
{
    [Required]
    public string DisplayName { get; set; } = "";

    [Required]
    [EmailAddress]
    public string email { get; set; } = "";

    [Required]
    [MinLength(4)]
    [PasswordPropertyText]
    public string password { get; set; } = "";
}
