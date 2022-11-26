const fs = require('fs');

class Container{
    constructor(_filePath) {
        this.filePath = _filePath;
    }
    
    getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1) + min);
    }

    getLength(){
        let obj = fs.readFileSync(this.filePath, 'utf-8', (err, value) => {if(err) throw err;});
        let parsedObj = JSON.parse(obj);

        console.log(parsedObj.length);
        return parsedObj.length;
    }

    readContainer = async () =>{ 
        try{
            let obj = fs.readFile(this.filePath, 'utf8', function (err, data){    
                if(err){
                    throw err;
                }
                else{
                    return obj;
                }
            })
        }
        catch(err){ console.error(err); }
    }
    

    save = async (object) => {
        if(object == undefined) {return console.error('Objeto indefinido');}
        let fileDir = object;
    
        let obj = fs.readFileSync(fileDir, 'utf-8', (err, value) => {
            if(err){
                console.log(err);
                console.error(`Failed to read the file ${objs}`);
            }else{
                let nuevoObjeto;
                nuevoObjeto = JSON.parse(value);
                return nuevoObjeto;
            }
        })
        let objetoLocal = fs.readFileSync(this.filePath, 'utf-8', (err, value) => {
            if(err){
                console.log(err);
                console.error(`Failed to read the file ${objs}`);
            }else{
                let nuevoObjeto;
                nuevoObjeto = JSON.parse(value);
                return nuevoObjeto;
            }
        })
        
        //Transformamos los strings en objetos
        let externParsed = JSON.parse(obj);
        let localParsed = JSON.parse(objetoLocal);

        // Mapeamos los ID del objeto local
        let result = localParsed.map(a => a.id);
        console.log(result);
        
        //Obtenemos el ID mas alto
        let maxId;
        if(result.length > 0){
            maxId = result.reduce((a, b) => Math.max(a, b), -Infinity); //console.log({maxId});// --Debug
        }
        else{ maxId = 0; }

        
        // Correccion del numero de ID del objeto a incorporar
        externParsed.id = maxId + 1;

        let localStr = JSON.stringify(localParsed,`,`,' ');
        localStr = (localStr.slice(1, -2));
        
        let externStr = JSON.stringify(externParsed,`}`,' ');

        let finalObj = `[${localStr + ','}\n${externStr}\n]`; // Parseo manual del string final
        
        //Sobre-escritura del documento utilizando el string formateado del nuevo objeto
        try{
            fs.writeFile(this.filePath, finalObj, (err, value) => {
                if (err) console.error(err + ' Failed to append on file');
                else{
                    console.log('Archivo actualizado');
                }
            });
        }catch(err){console.error(err); throw err};

    }


    getById = async (number) =>{
        let fileData, parsedData, filtered;
        console.log({number});
        try {
            fileData = await fs.promises.readFile(this.filePath, 'utf-8');
            parsedData = JSON.parse(fileData);

            filtered = parsedData.filter((parsedData) => {return parsedData.id == number.toString();})

            if(Array.isArray(filtered) && !filtered.length){console.error(`That number doesn't exist`); return null;}
            
            return filtered;

        }catch (err){console.error('No se pudo filtrar un objeto, ERROR: ' + err); throw (err);}
        
    }

    getAll = async () =>{
        let fileData;
        try {
            fileData = await fs.promises.readFile(this.filePath, 'utf-8')
            //console.log(`FILE DATA: \n${fileData}`); --DEBUG
            return fileData;
        }catch (err){throw (err);}
    }
    
    deleteById = async (number) =>{
        let fileData, parsedData, smallerId, biggerId;
        
        try {
            let min = this.getLength();
            if(min < number) {console.log('No existe el objeto'); return null};
            
            fileData = await fs.promises.readFile(this.filePath, 'utf-8');
            parsedData = JSON.parse(fileData);

            // Guardado en array de los objetos con ID mayores al parametro
            biggerId = parsedData.filter((parsedData) => { return parsedData.id > number;});
            biggerId.forEach(element => {
                element.id = element.id - 1;
            });
            
            // Guardado en array con los ID que sean menores al parametro
            smallerId = parsedData.filter(function (parsedData){ return parsedData.id < number;});
    
            // Strings auxiliares para formatear facilmente 
            let stringA = JSON.stringify(smallerId);
            let stringB = JSON.stringify(biggerId);
            let stringAB;

            
            if(!biggerId.length) stringAB = stringA.slice(1, -1);
            else stringAB = (stringA.slice(1, -1) + ',') + stringB.slice(1, -1);
            
            // Generacion de un string final para insertar en el archivo
            let finalString = `[${stringAB}]`;
            
            // Sobre-escritura final del archivo con los objetos modificados
            try{
                fs.writeFile(this.filePath, finalString, (err, value) => {
                    if (err) console.error(err + ' Failed to append on file');
                    else console.log('Elemento eliminado');
                });
                
            }catch(err){console.error('No se pudo sobreescribir el archivo '+ err); throw err};
            
        }catch (err){console.error('No se pudo filtrar un objeto, ERROR: ' + err); throw (err);}
    }

    deleteAll = async (path) => {
        let fileData;
        try { // Chequeo de que existencia del archivo
            fileData = await fs.promises.readFile(path, 'utf-8');
            try {
                await fs.promises.writeFile(path,''); //Formateo total del archivo
                console.log('Archivo Formateado');
            } catch (err) {console.error('No se pudo escribir el archivo ERROR: ' + err); throw (err);}

        } catch (err) {console.error('No se pudo abrir el archivo ERROR: ' + err); throw (err);}
    }
}


module.exports = Container;