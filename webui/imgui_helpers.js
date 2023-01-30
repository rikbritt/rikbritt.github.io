function GetSortedObjectKeys(obj)
{
    var entries = Object.keys(obj);
    var sorted = entries.sort();
    return sorted;
}