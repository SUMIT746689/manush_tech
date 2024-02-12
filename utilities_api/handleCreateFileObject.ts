export const handleCreateFileObj = (event) => {
    try {
        const filePrev = [];
        const files = [];

        Array.prototype.forEach.call(event.target.files, (file) => {
            files.push(file);
            const objectUrl = URL.createObjectURL(file);
            filePrev.push({ name: file.name, src: objectUrl, type: file.type })
            // console.log({ objectUrl });
            // console.log({ file })
        });
        return { err: null, files, objFiles: filePrev }
    }
    catch (err) {
        return { err: err.message, files: [], objFiles: [] }
    }
}