namespace example1.Types;

[QueryType]
public static class Query
{
    public static string Greetings(string name = "World")
        => $"Hello, {name}!";

    public static Book GetBook()
        => new Book("C# in depth.", new Author("Jon Skeet"));
}
