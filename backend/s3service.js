const { 
  GetObjectCommand, 
  PutObjectCommand, 
  DeleteObjectCommand, 
  ListObjectsV2Command 
} = require('@aws-sdk/client-s3');
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');
const { s3Client } = require('./aws-config');

const BUCKET_NAME = process.env.AWS_BUCKET_NAME;

class S3Service {
  // Upload un fichier
  async uploadFile(key, buffer, contentType) {
    const command = new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
      Body: buffer,
      ContentType: contentType,
    });

    return await s3Client.send(command);
  }

  // Générer une URL signée pour télécharger un fichier
  async getSignedDownloadUrl(key, expiresIn = 3600) {
    const command = new GetObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
    });

    return await getSignedUrl(s3Client, command, { expiresIn });
  }

  // Lister les fichiers
  async listFiles(prefix = '') {
    const command = new ListObjectsV2Command({
      Bucket: BUCKET_NAME,
      Prefix: prefix,
    });

    return await s3Client.send(command);
  }

  // Supprimer un fichier
  async deleteFile(key) {
    const command = new DeleteObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
    });

    return await s3Client.send(command);
  }

  // Test de connexion
  async testConnection() {
    try {
      const command = new ListObjectsV2Command({
        Bucket: BUCKET_NAME,
        MaxKeys: 1,
      });
      
      await s3Client.send(command);
      return { success: true, message: 'Connexion S3 réussie' };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
}

module.exports = new S3Service();