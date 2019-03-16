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

    static async updateEvent(event,email){
        //use mongo to merge photos´ array

        //{ $setDifference: [ "photos", event.photos.toAdd ] }
        //{ $setUnion: [ "photos", event.photos.toDelete] }
    }
 }