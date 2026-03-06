using System;
using System.Net.WebSockets;
using System.Security.Cryptography;
using System.Text;
using API.Data;
using API.DTOs;
using API.Entities;
using API.Interfaces;
using API.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers;

public class AccountController(AppDbContext appDb,ITokenService tokenService) : BaseApiController
{
    [HttpPost("register")] //api/Account/register

    public async Task<ActionResult<UserDTO>> Register(RegisterDTO dTO)
    {
        if (await ExistingEmailOrNot(dTO.email)) return BadRequest("Email taken ");
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
        return  new UserDTO
        {
            Id = user.Id,
            DisplayName = user.DisplayName,
            Email = user.Email,
            token = await tokenService.CreateToken(user)
        };
    }
    private async Task<bool> ExistingEmailOrNot(string email)
    {
        return await appDb.Users.AnyAsync(x => x.Email.ToLower() == email.ToLower());
    }

    [HttpPost("login")]

    public async Task<ActionResult<UserDTO>> Login(LoginDTO loginDTO)
    {
        var user = await appDb.Users.SingleOrDefaultAsync(x => x.Email == loginDTO.email);
        if (user == null) return Unauthorized("Invalid email address");
        using var hmac = new HMACSHA512(user.PasswordSalt);
        var computedhash = hmac.ComputeHash(Encoding.UTF8.GetBytes(loginDTO.password));
        for (var i = 0; i < computedhash.Length; i++)
        {
            if (computedhash[i] != user.PasswordHash[i]) return Unauthorized("invalid password");
        }
        return new UserDTO
        {
            Id = user.Id,
            DisplayName = user.DisplayName,
            Email = user.Email,
            token = await tokenService.CreateToken(user)
        };

    }
    
}
