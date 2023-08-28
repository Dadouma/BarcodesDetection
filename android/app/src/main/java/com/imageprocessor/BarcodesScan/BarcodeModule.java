package com.imageprocessor.BarcodesScan;

import android.graphics.Point;
import android.graphics.Rect;
import android.net.Uri;
import android.util.Log;

import androidx.annotation.NonNull;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.WritableArray;
import com.facebook.react.bridge.WritableMap;
import com.google.android.gms.tasks.OnFailureListener;
import com.google.android.gms.tasks.OnSuccessListener;
import com.google.android.gms.tasks.Task;
import com.google.mlkit.vision.barcode.BarcodeScanner;
import com.google.mlkit.vision.barcode.BarcodeScanning;
import com.google.mlkit.vision.barcode.common.Barcode;
import com.google.mlkit.vision.common.InputImage;

import java.io.IOException;
import java.util.List;

public class BarcodeModule extends ReactContextBaseJavaModule {
    BarcodeModule(ReactApplicationContext context) {

        super(context);
    }

    @Override
    public String getName() {
        return "BarcodeModule";
    }

    @ReactMethod
    public void recognizeBarcode(String url, Promise promise){
        Log.d("BarcodeModuleAdam", "dey: " + url);
        Log.i("hedha raw url ",url);
        Uri uri= Uri.parse(url);
        // [START get_detector]
        BarcodeScanner scanner = BarcodeScanning.getClient();
        // [END get_detector]
        InputImage image;
        try {
            image = InputImage.fromFilePath(getReactApplicationContext(), uri);

            // [START run_detector]
            Task<List<Barcode>> result = scanner.process(image);
            result.addOnSuccessListener(new OnSuccessListener<List<Barcode>>() {
                        @Override
                        public void onSuccess(List<Barcode> barcodes) {

                            ReactContext reactContext = getReactApplicationContext();
                            WritableMap barcodeArray = Arguments.createMap();
                            WritableArray barcodeData= Arguments.createArray();
                            WritableArray barcodesCoord= Arguments.createArray();
                            barcodeArray.putInt("widthImage", image.getWidth());
                            barcodeArray.putInt("heightImage", image.getHeight());
                            for (Barcode barcode: barcodes) {
                                String rawValue = barcode.getRawValue();
                                int valueType = barcode.getValueType();
                                Rect bounds = barcode.getBoundingBox();
                                Point[] corners = barcode.getCornerPoints();
                                WritableArray coord= Arguments.createArray();
                                Log.d("Barcodes", "valuetype: " + valueType);
                                Log.d("Barcodes", "bounds: " + bounds);
                                Log.d("Barcodes", "corners: " + corners);
                                barcodeData.pushString(rawValue);
                                coord.pushInt(bounds.left);
                                coord.pushInt(bounds.top);
                                coord.pushInt(bounds.bottom-bounds.top);
                                coord.pushInt(bounds.right-bounds.left);
                                barcodesCoord.pushArray(coord);

                                //end java to js

                            }
                            Log.d("Barcodes", "barcodesList: "+ barcodeData);
                            barcodeArray.putArray("barcodesCoord",barcodesCoord);
                            barcodeArray.putArray("barcodesList",barcodeData);

                            // [END get_barcodes]
                            // [END_EXCLUDE]
                            promise.resolve(barcodeArray);

                        }


                    })

                    .addOnFailureListener(new OnFailureListener() {
                        @Override
                        public void onFailure(@NonNull Exception e) {
                            // Task failed with an exception
                            promise.reject("Create Event Error", e);
                        }
                    });
            // [END run_detector]
        } catch (IOException e) {
            e.printStackTrace();
        }

    }

}