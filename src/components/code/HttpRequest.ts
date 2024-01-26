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

        let response = await axios.post(url, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        })

        if (response.status === 200) {
            // Die Antwort könnte die bearbeitete Bilddaten-URL enthalten (ersetze 'BEARBEITETE_BILD_URL' durch den tatsächlichen Schlüssel in deiner Antwort)
            const bearbeitetesBildURL = response.data.BEARBEITETE_BILD_URL;

            // Hier kannst du das bearbeitete Bild verwenden oder die URL speichern
            console.log('Bearbeitetes Bild URL:', bearbeitetesBildURL);

            // Gib die bearbeitete Bilddaten-URL zurück
            return bearbeitetesBildURL;
        } else {
            console.error('Unerwarteter Statuscode:', response.status);
            // Gib einen Fehler zurück (du kannst dies anpassen)
            return 'error';
        }

    }
}