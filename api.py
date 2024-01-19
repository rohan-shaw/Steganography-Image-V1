# Importing the required libraries
import cv2
from fastapi import FastAPI, File, UploadFile, HTTPException, Form, Depends
from fastapi.middleware.cors import CORSMiddleware
import numpy as np
import os
import datetime
import base64
from motor.motor_asyncio import AsyncIOMotorClient
from pymongo.server_api import ServerApi

app = FastAPI(docs_url=None, openapi_url=None, redoc_url=None)

# MongoDB connection settings
MONGODB_URL = os.environ.get("mongoUrl")
DATABASE_NAME = os.environ.get("databaseName")
COLLECTION_NAME = "inkognitoUsers"

# Allowing CORS (Cross-Origin Resource Sharing)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# MongoDB client initialization
async def get_database_client():
    client = AsyncIOMotorClient(MONGODB_URL)
    database = client[DATABASE_NAME]
    yield database
    client.close()

# @app.on_event("startup")
# def save_openapi_json():
#     openapi_data = app.openapi()
#     with open("openapi.json", "w") as file:
#         json.dump(openapi_data, file)

# Converting types to binary  
def msg_to_bin(msg):  
    if type(msg) == str:  
        return ''.join([format(ord(i), "08b") for i in msg])  
    elif type(msg) == bytes or type(msg) == np.ndarray:  
        return [format(i, "08b") for i in msg]  
    elif type(msg) == int or type(msg) == np.uint8:  
        return format(msg, "08b")  
    else:  
        raise TypeError("Input type not supported")  

# defining function to hide the secret message into the image  
def hide_data(img, secret_msg):  
    # calculating the maximum bytes for encoding  
    nBytes = img.shape[0] * img.shape[1] * 3 // 8  
    print("Maximum Bytes for encoding:", nBytes)  
    # checking whether the number of bytes for encoding is less  
    # than the maximum bytes in the image  
    if len(secret_msg) > nBytes:  
        raise ValueError("Error encountered insufficient bytes, need bigger image or less data!!")  
    secret_msg += '#####'       # we can utilize any string as the delimiter  
    dataIndex = 0  
    # converting the input data to binary format using the msg_to_bin() function  
    bin_secret_msg = msg_to_bin(secret_msg)  
  
    # finding the length of data that requires to be hidden  
    dataLen = len(bin_secret_msg)  
    for values in img:  
        for pixels in values:  
            # converting RGB values to binary format  
            r, g, b = msg_to_bin(pixels)  
            # modifying the LSB only if there is data remaining to store  
            if dataIndex < dataLen:  
                # hiding the data into LSB of Red pixel  
                pixels[0] = int(r[:-1] + bin_secret_msg[dataIndex], 2)  
                dataIndex += 1  
            if dataIndex < dataLen:  
                # hiding the data into LSB of Green pixel  
                pixels[1] = int(g[:-1] + bin_secret_msg[dataIndex], 2)  
                dataIndex += 1  
            if dataIndex < dataLen:  
                # hiding the data into LSB of Blue pixel  
                pixels[2] = int(b[:-1] + bin_secret_msg[dataIndex], 2)  
                dataIndex += 1  
            # if data is encoded, break out the loop  
            if dataIndex >= dataLen:  
                break  
      
    return img  
  
def show_data(img):  
    bin_data = ""  
    for values in img:  
        for pixels in values:  
            # converting the Red, Green, Blue values into binary format  
            r, g, b = msg_to_bin(pixels)  
            # data extraction from the LSB of Red pixel  
            bin_data += r[-1]  
            # data extraction from the LSB of Green pixel  
            bin_data += g[-1]  
            # data extraction from the LSB of Blue pixel  
            bin_data += b[-1]  
    # split by 8-Bits  
    allBytes = [bin_data[i: i + 8] for i in range(0, len(bin_data), 8)]  
    # converting from bits to characters  
    decodedData = ""  
    for bytes in allBytes:  
        decodedData += chr(int(bytes, 2))  
        # checking if we have reached the delimiter which is "#####"  
        if decodedData[-5:] == "#####":  
            break  
    # print(decodedData)  
    # removing the delimiter to display the actual hidden message  
    return decodedData[:-5]  

@app.get("/")
async def root():
    return {"message": "Server is alive"}

@app.post("/hide_message")
async def hide_message(image: UploadFile = File(...), secret_msg: str = Form(...)):
    try:
        # Read image using OpenCV
        content = await image.read()
        nparr = np.frombuffer(content, np.uint8)
        img = cv2.imdecode(nparr, cv2.IMREAD_UNCHANGED)

        # Hide the secret message in the image
        encoded_image = hide_data(img, secret_msg)

        # Convert the image to bytes
        _, encoded_image_data = cv2.imencode(".png", encoded_image)
        encoded_image_bytes = encoded_image_data.tobytes()

        # Encode the image bytes to base64
        encoded_image_base64 = base64.b64encode(encoded_image_bytes).decode()

        # Return the base64 encoded image
        return {"base64_image": encoded_image_base64}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# API endpoint to retrieve the secret message from an image
@app.post("/retrieve_message")
async def retrieve_message(image: UploadFile = File(...)):
    try:
        # Read image using OpenCV
        content = await image.read()
        nparr = np.frombuffer(content, np.uint8)
        img = cv2.imdecode(nparr, cv2.IMREAD_UNCHANGED)

        # Retrieve the hidden message from the image
        decoded_message = show_data(img)

        return {"decoded_message": decoded_message}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
@app.post("/save_user_data")
async def save_user_data(name: str = Form(...), email: str = Form(...), database: AsyncIOMotorClient = Depends(get_database_client)):
    try:
        # Save user data to MongoDB
        users_collection = database[COLLECTION_NAME]
        user_data = {
            "name": name,
            "email": email,
            "first_login": datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
        }
        result = await users_collection.insert_one(user_data)

        # Return success response
        return {"message": "User data saved successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get(os.environ.get("getUsersEp"))
async def get_all_users(database: AsyncIOMotorClient = Depends(get_database_client)):
    try:
        # Retrieve all users from MongoDB
        users_collection = database[COLLECTION_NAME]
        all_users = await users_collection.find({}, {"_id": 0}).to_list(length=None)

        # Return the list of all users
        return {"users": all_users}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
