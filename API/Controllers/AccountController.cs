using System;
using System.Security.Cryptography;
using System.Text;
using API.Data;
using API.DTOs;
using API.Entities;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

public class AccountController(AppDbContext appDb) : BaseApiController
{
    [HttpPost("register")] //api/Account/register
    public async Task<ActionResult<AppUser>> Register(RegisterDTO dTO)
    {
        using var hmac = new HMACSHA512();
        var user = new AppUser
        {
            DisplayName = dTO.DisplayName,
            Email = dTO.email,
            PasswordHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(dTO.password)),
            PasswordSalt = hmac.Key

        };
        appDb.Users.Add(user);
        await appDb.SaveChangesAsync();
        return user;

    }

    
}
