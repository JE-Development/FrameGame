import axios from 'axios'


export class HttpRequest{
    async httpRequest(url: string): Promise<any>{

        let ok = true;

        let json;

        await axios.get(url)
            .then((response: any) => {
                json = response.data;
            })
            .catch((error: any) => {
                console.log(error)
            });
        if(ok) {
            return json;
        }else{
            return "error";
        }

    }

    async httpRequestHeader(url: string, header: any): Promise<any>{

        let ok = true;

        let json;

        await axios.get(url, {headers: header})
            .then(response => {
                json = response.data;
            })
            .catch(error => {
                console.log(error)
            });
        if(ok) {
            return json;
        }else{
            return "error";
        }

    }

    async httpRequestPost(url: string, key: string, value: string): Promise<any>{

        let ok = true;

        let json;

        let formData = new FormData()
        formData.append(key, value)

        axios.post(url, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        }).then(response => {
            // Konvertiere die Antwort in eine Base64-codierte URL
            const imageBase64 = btoa(
                new Uint8Array(response.data).reduce(
                    (data, byte) => data + String.fromCharCode(byte),
                    ''
                )
            );
            // Setze die URL als src für das Bild
            let imageUrl = `data:image/png;base64,${imageBase64}`;
            console.log(imageBase64)
        })

    }
}