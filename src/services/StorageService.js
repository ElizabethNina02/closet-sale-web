import { supabase } from '../config/supabase';

/**
 * Sube múltiples imágenes a Supabase Storage y retorna sus URLs públicas.
 * @param {File[]} files - Arreglo de archivos binarios (ej. [file1, file2, file3]).
 * @param {string} bucketName - Nombre del bucket.
 * @returns {Promise<string[]>} Un arreglo con las URLs públicas en formato texto.
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

      return publicUrlData.publicUrl;
    });

    // Espera a que todas las subidas terminen y retorna el array de URLs ['url1', 'url2', 'url3']
    return await Promise.all(uploadPromises);

  } catch (error) {
    console.error("Error en uploadMultipleImagesAndGetUrls:", error);
    throw error;
  }
};
