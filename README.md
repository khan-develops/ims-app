baseURLs:

services: http://localhost:9080
experiences: http://localhost:8080
requests: http://localhost:7080

Resources:

masterItems: `http://localhost:9080/api/inventory/services/master/list?page=${pagination.page}&size=${pagination.size}`
extractionsItems: `http://localhost:9080/api/inventory/services/extractions/list?page=${pagination.page}&size=${pagination.size}`
storeRoomItems: `http://localhost:9080/api/inventory/services/store-room/list?page=${pagination.page}&size=${pagination.size}`

masterExperienceItems: `http://localhost:8080/api/inventory/experiences/master/list?page=${pagination.page}&size=${pagination.size}`
extractionsExperienceItems: `http://localhost:8080/api/inventory/experiences/extractions/list?page=${pagination.page}&size=${pagination.size}`
storeRoomItems: `http://localhost:8080/api/inventory/experiences/store-room/list?page=${pagination.page}&size=${pagination.size}`

storeRoomRequestItems: `http://localhost:7080/api/inventory/services/requests/store-room/list?page=${pagination.page}&size=${pagination.size}`
