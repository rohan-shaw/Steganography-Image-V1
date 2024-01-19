# Steganography-Image-V1

Here is a complete production ready application of steganography where users can hide their secret message inside an image.

## Server
The `/server` directory consists of the codes for API Server in `api.py`, requirements to install in `requirements.txt` and a Dockerfile if you want to use docker to run the api in `Dockerfile`

- note : in the api.py file change your database credentials and the api endpoint to view the database or comment out them.

## Client
The `/client` directory consists of html, css and js file for the frontend and assets for the frontend

## How to run
Running the application is very easy, here are the steps :
- open your shell and run
  ```
  git clone https://github.com/rohan-shaw/Steganography-Image-V1.git
  ```
- run
  ```
  cd Steganography-Image-V1/server
  ```
- run the command
  ```
  pip install -r requirements.txt
  ```
- run the command
  ```
  uvicorn api:app --host 0.0.0.0 --port 7860
  ```
- you can also build and run this with docker instead if you have docker installed [optional]
- go the client directory and open the live server or from file manager open the html file in chrome.
- Hurrah, you have successfully run the application. Now go the url and enjoy.......
