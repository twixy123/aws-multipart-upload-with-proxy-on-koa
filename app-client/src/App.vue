<template>
  <div>
    <input type="file" id="file" @change="upload" />
    <button @click="abort">abort</button>
  </div>
</template>

<script>
export default {
  name: "EntireApp",
  data() {
    return {
      url: "http://localhost:9000/bff/s3-bucket",
      chunkSize: 10 * 1024 * 1024,
      uploadId: "",
      file: null,
      fileName: "",
      fileSize: "",
      controller: null,
      signal: null,
    };
  },
  methods: {
    async upload() {
      try {
        this.file = event.target.files[0];
        this.fileName = this.file.name;
        this.fileSize = this.file.size;

        this.controller = new AbortController();
        this.signal = this.controller.signal;

        this.uploadId = await this.getUploadId();
        const location = await this.multipartUpload();
        console.log(location);
      } catch (error) {
        console.log("Error: ", error);
      }
    },

    async getUploadId() {
      const url = `${this.url}/get-multipart-upload-id?fileName=${this.fileName}`;
      const req = await fetch(url);
      const res = await req.json();
      return res.uploadId;
    },

    async getUploadPartAssignedUrl(partNumber) {
      const body = JSON.stringify({
        fileName: this.fileName,
        uploadId: this.uploadId,
        partNumber,
      });

      const res = await fetch(`${this.url}/get-upload-part-url`, {
        method: "post",
        headers: {
          "Content-Type": "application/json",
        },
        body,
        signal: this.signal,
      });
      const req = await res.json();
      return req.url;
    },

    async uploadChunkToBucket(preSignedUploadUrl, fileBlob) {
      const res = await fetch(preSignedUploadUrl, {
        method: "put",
        headers: {
          "Content-Type": "application/json",
        },
        body: fileBlob,
        signal: this.signal,
      });
      return res.headers.get("ETag");
    },

    onProgress(progressData) {
      console.log("onProgress", progressData);
    },

    async completeMultipartUpload(uploadedChunks) {
      const body = JSON.stringify({
        fileName: this.fileName,
        uploadId: this.uploadId,
        parts: uploadedChunks,
      });

      const res = await fetch(`${this.url}/complete-upload`, {
        method: "post",
        headers: {
          "Content-Type": "application/json",
        },
        body,
      });

      const req = await res.json();
      return req.location;
    },

    async multipartUpload() {
      const chunkCount = Math.floor(this.fileSize / this.chunkSize) + 1;
      const uploadedChunks = [];

      for (let uploadCount = 1; uploadCount < chunkCount + 1; uploadCount++) {
        const start = (uploadCount - 1) * this.chunkSize;
        const end = uploadCount * this.chunkSize;
        const fileBlob =
          uploadCount < chunkCount
            ? this.file.slice(start, end)
            : this.file.slice(start);

        const preSignedUploadUrl = await this.getUploadPartAssignedUrl(
          uploadCount
        );

        const ETag = await this.uploadChunkToBucket(
          preSignedUploadUrl,
          fileBlob
        );

        const uploadDetails = {
          ETag,
          PartNumber: uploadCount,
        };

        uploadedChunks.push(uploadDetails);

        this.onProgress({
          chunksCount: chunkCount,
          uploadedCount: uploadCount,
          chunkSize: this.chunkSize,
          fileSize: this.fileSize,
          startSlicing: start,
          endSlicing: end,
        });
      }

      return await this.completeMultipartUpload(uploadedChunks);
    },

    async abort() {
      if (!this.uploadId) {
        return;
      }

      try {
        const body = JSON.stringify({
          fileName: this.fileName,
          uploadId: this.uploadId,
        });

        await fetch(`${this.url}/abort-upload`, {
          method: "post",
          headers: {
            "Content-Type": "application/json",
          },
          body
        })

        this.controller.abort()
        this.uploadId =  ""
        this.fileName =  ""
        this.fileSize =  ""
        this.file =  null
        this.controller =  null
        this.signal =  null
      } catch (error) {
        console.log(error);
      }
    },
  },
};
</script>