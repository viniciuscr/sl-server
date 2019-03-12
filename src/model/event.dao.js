export default class EventDao {
    static async saveEvent() {

    }
    static async getEvent(code,email){
        return {
            _id:code,
            name:"nome do evento",
            photos:{
                src: "/static/abacate@jjfhd/img001.jpeg"
            },
        }
    }
 }