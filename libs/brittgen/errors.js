bg.errors = [];

bg.LogError = function (error)
{
    if (typeof error === 'string' || error instanceof String)
    {
        bg.errors.push(error);
    }
    else
    {
        bg.errors.push(error.message);
    }
}