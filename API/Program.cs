using API.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);
builder.Services.AddDbContext<AppDataContext>();

builder.Services.AddCors(options =>
    options.AddPolicy("Acesso Total",
        configs => configs
            .AllowAnyOrigin()
            .AllowAnyHeader()
            .AllowAnyMethod())
);

var app = builder.Build();


app.MapGet("/", () => "Prova A1");

//ENDPOINTS DE CATEGORIA
//GET: http://localhost:5152/categoria/listar
app.MapGet("/categoria/listar", ([FromServices] AppDataContext ctx) =>
{
    if (ctx.Categorias.Any())
    {
        return Results.Ok(ctx.Categorias.ToList());
    }
    return Results.NotFound("Nenhuma categoria encontrada");
});

//POST: http://localhost:5152/categoria/cadastrar
app.MapPost("/categoria/cadastrar", ([FromServices] AppDataContext ctx, [FromBody] Categoria categoria) =>
{
    ctx.Categorias.Add(categoria);
    ctx.SaveChanges();
    return Results.Created("", categoria);
});

//ENDPOINTS DE TAREFA
//GET: http://localhost:5152/tarefas/listar
app.MapGet("/tarefas/listar", ([FromServices] AppDataContext ctx) =>
{
    if (ctx.Tarefas.Any())
    {
        return Results.Ok(ctx.Tarefas.ToList());
    }
    return Results.NotFound("Nenhuma tarefa encontrada");
});

//POST: http://localhost:5152/tarefas/cadastrar
app.MapPost("/tarefas/cadastrar", ([FromServices] AppDataContext ctx, [FromBody] Tarefa tarefa) =>
{
    Categoria? categoria = ctx.Categorias.Find(tarefa.CategoriaId);
    if (categoria == null)
    {
        return Results.NotFound("Categoria não encontrada");
    }

    tarefa.Categoria = categoria;
    tarefa.Status = "Não iniciada";
    
    ctx.Tarefas.Add(tarefa);
    ctx.SaveChanges();
    return Results.Created("", tarefa);
});

app.MapDelete("/tarefas/deletar/{id}", ([FromServices] AppDataContext ctx, [FromRoute] string id)=>{

    Tarefa? tarefa = ctx.Tarefas.Find(id);

    if(tarefa is null){
        return Results.NotFound("Tarefa não encontrada!");
    }

    ctx.Tarefas.Remove(tarefa);
    ctx.SaveChanges();

    return Results.Ok(ctx.Tarefas.ToList());
});

//PATCH: http://localhost:5152/tarefas/alterar/{id}
app.MapPatch("/tarefas/alterar/{id}", ([FromServices] AppDataContext ctx, [FromRoute] string id) =>
{
    Tarefa? tarefa = ctx.Tarefas.Find(id);

    if(tarefa is null){
        return Results.NotFound("Tarefa não encontrada!");
    }

    if(tarefa.Status == "Não iniciada"){
        tarefa.Status = "Em andamento";
    }else if(tarefa.Status == "Em andamento"){
        tarefa.Status = "Concluída";
    }else if(tarefa.Status == "Concluída"){
        return Results.BadRequest("A tarefa já se encontra Concluída!");
    }else{
        tarefa.Status = "Não iniciada";
    }

    ctx.Tarefas.Update(tarefa);
    ctx.SaveChanges();

    return Results.Ok(ctx.Tarefas.ToList());
});

//GET: http://localhost:5152/tarefas/naoconcluidas
app.MapGet("/tarefas/naoconcluidas", ([FromServices] AppDataContext ctx) =>
{
    var tarefas = ctx.Tarefas.Where(t => t.Status == "Não iniciada" || t.Status == "Em andamento").ToList();
    
    if(ctx.Tarefas.Any()){
        return Results.Ok(tarefas);
    }

    return Results.NotFound("Não há nenhuma tarefa que não estaja concluida!");
});

//GET: http://localhost:5152/tarefas/concluidas
app.MapGet("/tarefas/concluidas", ([FromServices] AppDataContext ctx) =>
{
    var tarefas = ctx.Tarefas.Where(t => t.Status == "Concluída").ToList();
    
    if(tarefas.Any()){
        return Results.Ok(tarefas);
    }

    return Results.NotFound("Nenhuma tarefa concluida!");
});

app.UseCors("Acesso Total");
app.Run();


