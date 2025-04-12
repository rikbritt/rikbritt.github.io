
var mech = {};

mech.partTypes = [];
mech.RegisterPartType = function()
{

}

// List of parts

mech.CreateSim = function()
{
    var sim = {
        mechs:[]
    };
    return sim;
}

mech.CreateRandomMech = function(sim)
{
    var mech = {};
    sim.mechs.push(mech);
    return mech;
}