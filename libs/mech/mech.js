
var mechJS = {};

mechJS.partTypes = [];
mechJS.RegisterPartType = function()
{

}

// List of parts

mechJS.CreateSim = function()
{
    var sim = {
        mechs:[]
    };
    return sim;
}

mechJS.CreateRandomMech = function(sim)
{
    var mech = {};
    sim.mechs.push(mech);
    return mech;
}