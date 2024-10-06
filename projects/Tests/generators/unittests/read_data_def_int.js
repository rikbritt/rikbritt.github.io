export var generator = {
    "id": "81461a5d-5a1c-4d2d-ac4b-d912c7917c71",
    "name": "Read Data Def Basic Values",
    "description": "",
    "category": [
        "Test",
        "Unit Tests"
    ],
    "inputs": {
        "name": "inputs",
        "version": 1,
        "fields": [
            {
                "dataType": {},
                "name": "data_in",
                "type": "data_def",
                "default_def": "659baaad-ecff-4e2c-b3a8-8334792be835"
            }
        ],
        "id": "a8aff967-e164-9a1c-82ea-607c881e8091",
        "category": []
    },
    "outputs": {
        "name": "outputs",
        "version": 1,
        "fields": [
            {
                "min": 0,
                "max": 100,
                "name": "int_out",
                "type": "int"
            }
        ],
        "id": "25bef4f2-5b60-430e-2ef3-77f1a2b97577",
        "category": []
    },
    "version": 3,
    script:function(inputs, outputs){
        outputs.data = inputs;
    }
};