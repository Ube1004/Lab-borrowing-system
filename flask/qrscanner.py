from pyzbar.pyzbar import decode
import numpy as np
import time



def qrscan():
    import cv2
    
    cap = cv2.VideoCapture(0)

    if not cap.isOpened():
        print("Error: Could not open camera.")
        return "Error: Could not open camera."

    scanned_codes = set()  # To collect unique codes

    print("QR Code Scanner started. Press 'Enter' to stop.")

    while True:
        ret, frame = cap.read()
        if not ret:
            print("Error: Could not read frame.")
            break

        # Decode QR codes in the frame
        codes = decode(frame)

        for code in codes:
            data = code.data.decode("utf-8")
            if data not in scanned_codes:
                print("SCANNED:", data)
                scanned_codes.add(data)

 
        cv2.imshow("QR Code Scanner", frame)

  
        if cv2.waitKey(1) & 0xFF == 13:
            cap.release()
            cv2.destroyAllWindows()
            return list(scanned_codes) # Return the set of scanned codes as a string

    #cap.release()
    #cv2.destroyAllWindows()
    #if scanned_codes:
    #    return list(scanned_codes)
    #else:
    #   return "No QR code detected."
