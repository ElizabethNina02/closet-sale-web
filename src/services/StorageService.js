import { supabase } from '../config/supabase';

/**
 * Sube múltiples imágenes a Supabase Storage y retorna sus URLs públicas.
 * @param {File[]} files - Arreglo de archivos binarios (ej. [file1, file2, file3]).
 * @param {string} bucketName - Nombre del bucket.
 * @returns {Promise<Array<{publicUrl: string, uniqueName: string}>>} Un arreglo de objetos con las URLs y nombres únicos.
  */
export const uploadMultipleImagesAndGetUrls = async (files, bucketName = 'productos') => {
  try {
    // Procesamos todas las imágenes en paralelo de forma eficiente
    const uploadPromises = files.map(async (file) => {
      const fileExtension = file.name.split('.').pop();
      const cleanFileName = file.name.replace(`.${fileExtension}`, '').replace(/[^a-zA-Z0-9]/g, '_');
      const uniqueName = `${Date.now()}_${cleanFileName}.${fileExtension}`;

      // Subir archivo físico
      const { error: uploadError } = await supabase.storage
        .from(bucketName)
        .upload(uniqueName, file, {
          cacheControl: '3600',
          upsert: false,
        });

      if (uploadError) {
        throw new Error(`Error de Supabase al subir ${file.name}: ${uploadError.message}`);
      }

      // Obtener URL pública de este archivo concreto
      const { data: publicUrlData } = supabase.storage
        .from(bucketName)
        .getPublicUrl(uniqueName);

      // 🔑 RETORNO MODIFICADO: Devolvemos un objeto con ambos datos útiles
      return {
        url: publicUrlData.publicUrl,
        uniqueName: uniqueName // Este es el path relativo exacto para usar en .remove()
      };
    });

    // Espera a que todas las subidas terminen y retorna el array de URLs ['url1', 'url2', 'url3']
    return await Promise.all(uploadPromises);

  } catch (error) {
    console.error("Error en uploadMultipleImagesAndGetUrls:", error);
    throw error;
  }
};

/**
 * Elimina múltiples imágenes de un bucket de Supabase Storage en una sola petición.
 * 
 * @param {string[]} uniqueNames - Arreglo con los nombres únicos (paths relativos) de los archivos.
 * @param {string} bucketName - Nombre del bucket (por defecto 'productos').
 */
export const deleteMultipleImages = async (uniqueNames, bucketName = 'productos') => {
  // Si el arreglo viene vacío, salimos de inmediato para ahorrar una petición al servidor
  if (!uniqueNames || uniqueNames.length === 0) return;

  try {
    // 🔑 OPTIMIZACIÓN: Pasamos el arreglo completo directamente a .remove()
    const { data, error: deleteError } = await supabase.storage
      .from(bucketName)
      .remove(uniqueNames);

    if (deleteError) {
      throw new Error(`Error de comunicación con Supabase: ${deleteError.message}`);
    }

    if (!data || data.length === 0) {
      console.warn("No se eliminó ningún archivo físico en Supabase. Revisa si los uniqueNames son correctos.");
    } else {
      console.log(`Se eliminaron con éxito ${data.length} archivos de Supabase.`);
    }

  } catch (error) {
    console.error("Error en deleteMultipleImages:", error);
    throw error;
  } 
};



/**
 * Sube una sola imagen a Supabase Storage en el bucket 'users' y retorna su URL pública y nombre único.
 * @param {File} file - Archivo binario de la imagen.
 * @returns {Promise<{url: string, uniqueName: string}>} Objeto con la URL pública y el nombre único del archivo.
 */
export const uploadSingleUserImage = async (file) => {
  const bucketName = 'users';
  
  try {
    if (!file) {
      throw new Error("No se proporcionó ningún archivo para subir.");
    }

    // Extraer extensión y limpiar el nombre original del archivo
    const fileExtension = file.name.split('.').pop();
    const cleanFileName = file.name.replace(`.${fileExtension}`, '').replace(/[^a-zA-Z0-9]/g, '_');
    const uniqueName = `${Date.now()}_${cleanFileName}.${fileExtension}`;

    // Subir archivo físico al bucket 'users'
    const { error: uploadError } = await supabase.storage
      .from(bucketName)
      .upload(uniqueName, file, {
        cacheControl: '3600',
        upsert: false,
      });

    if (uploadError) {
      throw new Error(`Error de Supabase al subir ${file.name}: ${uploadError.message}`);
    }

    // Obtener la URL pública del archivo subido
    const { data: publicUrlData } = supabase.storage
      .from(bucketName)
      .getPublicUrl(uniqueName);

    // Retorna el objeto con la estructura que necesitas
    return {
      url: publicUrlData.publicUrl,
      uniqueName: uniqueName // Útil para operaciones futuras como .remove([uniqueName])
    };

  } catch (error) {
    console.error("Error en uploadSingleUserImage:", error);
    throw error;
  }
};