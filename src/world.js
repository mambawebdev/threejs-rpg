import * as THREE from 'three';

const texturedLoader = new THREE.TextureLoader();
const gridTexture = texturedLoader.load('textures/grid.png');

export class World extends THREE.Group {

    #objectMap = new Map();
    

    // Key will be the string which is the coords of a square.
    // Value will be the object at that specific location on the terrain

    constructor(width, height){
        super();
        this.width = width;
        this.height = height;
        this.treeCount = 10;
        this.rockCount = 20;
        this.bushCount = 10;

        this.trees = new THREE.Group();
        this.add(this.trees);

        this.rocks = new THREE.Group();
        this.add(this.rocks);

        this.bushes = new THREE.Group();
        this.add(this.bushes);
        
        // Create the material ONCE and store it as a property
        this.terrainMaterial = new THREE.MeshStandardMaterial({
            map: gridTexture
        });
        
        this.generate();        
    }
    generate(){
        this.clear();
        this.createTerrain();
        this.createTrees();
        this.createRocks();
        this.createBushes();
    }

    clear(){
        if(this.terrain){
            this.terrain.geometry.dispose();
            this.remove(this.terrain);
        }

        if(this.trees){
            this.trees.children.forEach((tree) => {
                tree.geometry?.dispose();
                tree.material?.dispose();
            })
            this.trees.clear();
        }

        if(this.rocks){
            this.rocks.children.forEach((rock) => {
                rock.geometry?.dispose();
                rock.material?.dispose();
            })
            this.rocks.clear();
        }

        if(this.bushes){
            this.bushes.children.forEach((bush) => {
                bush.geometry?.dispose();
                bush.material?.dispose();
            })
            this.bushes.clear();
        }

        this.#objectMap.clear();
    }

    createTerrain(){        
        gridTexture.repeat = new THREE.Vector2(this.width, this.height);
        /* 
        How many times the texture is repeated across the surface, 
        in each direction U and V (X and Y). If repeat is set greater than 1 in either direction, 
        the corresponding wrap parameter should also be set to RepeatWrapping or MirroredRepeatWrapping to achieve the desired tiling effect.
        */
        gridTexture.wrapS = THREE.RepeatWrapping;
        gridTexture.wrapT = THREE.RepeatWrapping;
        /* 
            A color space is a system for organizing colors, 
            defining how they are represented and interpreted to ensure
            consistent color display across various devices.
        */
        gridTexture.colorSpace = THREE.SRGBColorSpace;
        const terrainGeometry = new THREE.PlaneGeometry(
            this.width, 
            this.height, 
            this.width, 
            this.height
        );

        

        this.terrain = new THREE.Mesh(terrainGeometry, this.terrainMaterial);
        this.terrain.rotation.x = -Math.PI / 2;
        this.terrain.position.set(this.width / 2, 0, this.height / 2);
        this.add(this.terrain);
    }
    
    // Add Tree
    createTrees(){
        const treeRadius = 0.2;
        const treeHeight = 1;
        const treeGeometry = new THREE.ConeGeometry(treeRadius, treeHeight, 8);
        const treeMaterial = new THREE.MeshStandardMaterial({
            color: "darkgreen",
            flatShading: true,
        });
        
        
        
        for(let i = 0; i < this.treeCount; i++){

            const treeMesh = new THREE.Mesh(treeGeometry, treeMaterial);
            const coords = new THREE.Vector2(
                // Number between 0 and width of map
                Math.floor(this.width * Math.random()),
                // Number between 0 and height of map
                Math.floor(this.height * Math.random()),
            )


            // Ensures we don't place objects on top of each other
            if(this.#objectMap.has(`${coords.x}-${coords.y}`)) continue;

            treeMesh.position.set(
                coords.x + 0.5,
                treeHeight / 2,
                coords.y + 0.5,
            )
            this.trees.add(treeMesh);

            // Add to object map to ensure we know where the objects are.

            this.#objectMap.set(`${coords.x}-${coords.y}`, treeMesh);
        }
    }
    // Add Rock
    createRocks(){
        const minRockRadius = 0.1;
        const maxRockRadius = 0.3;
        const minRockHeight = 0.3;
        const maxRockHeight = 0.8;
        
        const rockMaterial = new THREE.MeshStandardMaterial({
            color: "#dadada",
            flatShading: true
        });
        
        
        
        for(let i = 0; i < this.rockCount; i++){
            // 0.2 + any number between 0 - 0.2
            const radius = minRockRadius + (Math.random() * (maxRockRadius - minRockRadius));
            const height = minRockHeight + (Math.random() * (maxRockHeight - minRockHeight));
            const rockGeometry = new THREE.SphereGeometry(radius, 6, 5);
            const rockMesh = new THREE.Mesh(rockGeometry, rockMaterial);

            const coords = new THREE.Vector2(
                // Number between 0 and width of map
                Math.floor(this.width * Math.random()),
                // Number between 0 and height of map
                Math.floor(this.height * Math.random()),
            )

            if(this.#objectMap.has(`${coords.x}-${coords.y}`)) continue;


            rockMesh.position.set(
                coords.x + 0.5,
                0,
                coords.y + 0.5,
            )
            rockMesh.scale.y = height;
            this.rocks.add(rockMesh);

            this.#objectMap.set(`${coords.x}-${coords.y}`, rockMesh);

        }
    }

    // Add Rock
    createBushes(){
        const minBushRadius = 0.07;
        const maxBushRadius = 0.25;

        
        const bushMaterial = new THREE.MeshStandardMaterial({
            color: "#677a1e",
            flatShading: true,
        });
        
        
        
        for(let i = 0; i < this.bushCount; i++){
            // 0.2 + any number between 0 - 0.2
            const radius = minBushRadius + (Math.random() * (maxBushRadius - minBushRadius));
            const bushGeometry = new THREE.SphereGeometry(radius, 9, 9);
            const bushMesh = new THREE.Mesh(bushGeometry, bushMaterial);

            const coords = new THREE.Vector2(
                // Number between 0 and width of map
                Math.floor(this.width * Math.random()),
                // Number between 0 and height of map
                Math.floor(this.height * Math.random()),
            )

            if(this.#objectMap.has(`${coords.x}-${coords.y}`)) continue;

            bushMesh.position.set(
                coords.x + 0.5,
                radius,
                coords.y + 0.5,
            )
            this.bushes.add(bushMesh);

            this.#objectMap.set(`${coords.x}-${coords.y}`, bushMesh);
        }
    }
}