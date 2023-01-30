function GetSortedObjectKeys(obj)
{
    var entries = Object.keys(obj);
    var sorted = entries.sort(([,a],[,b]) => a-b);
    return sorted;
}