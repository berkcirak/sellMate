package com.example.sellmate.service;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
public class FileUploadService {

    private final String uploadDir = "uploads/posts/";

    public FileUploadService(){
        try{
            Path uploadPath = Paths.get(uploadDir);
            if (!Files.exists(uploadPath)){
                Files.createDirectories(uploadPath);
            }
        }catch (IOException e){
            throw new RuntimeException("Could not create upload directory", e);
        }
    }
    public List<String> uploadImages(List<MultipartFile> images){
        System.out.println("DEBUG: Starting image upload...");
        System.out.println("DEBUG: Images count: " + (images != null ? images.size() : "null"));

        List<String> imageUrls = new ArrayList<>();
        if (images == null || images.isEmpty()){
            System.out.println("DEBUG: No images to upload");
            return imageUrls;
        }

        for (MultipartFile image : images){
            System.out.println("DEBUG: Processing: " + image.getOriginalFilename());
            System.out.println("DEBUG: File size: " + image.getSize());

            if (!image.isEmpty()){
                String fileName = generateFileName(image.getOriginalFilename());
                String filePath = uploadDir + fileName;
                System.out.println("DEBUG: Saving to: " + filePath);

                try{
                    Path path = Paths.get(filePath);
                    Files.copy(image.getInputStream(), path);
                    imageUrls.add("/uploads/posts/" + fileName);
                    System.out.println("DEBUG: Successfully saved: " + fileName);
                } catch (IOException e){
                    System.err.println("ERROR saving image: " + e.getMessage());
                    e.printStackTrace();
                    throw new RuntimeException("Could not save image: " + fileName, e);
                }
            }
        }
        return imageUrls;
    }

    private String generateFileName(String originalFileName){
        String extension = "";
        if (originalFileName != null && originalFileName.contains(".")){
            extension = originalFileName.substring(originalFileName.lastIndexOf("."));
        }
        return UUID.randomUUID().toString() + extension;
    }
    public String uploadProfileImage(MultipartFile image){
        System.out.println("DEBUG: Starting profile image upload...");
        System.out.println("DEBUG: File: " + (image != null ? image.getOriginalFilename() : "null"));

        if (image == null || image.isEmpty()){
            System.out.println("DEBUG: No profile image to upload");
            return null;
        }
        String fileName = generateFileName(image.getOriginalFilename());
        String filePath = uploadDir + fileName;
        try {
            Path path = Paths.get(filePath);
            Files.copy(image.getInputStream(), path);
            String imageUrl = "/uploads/posts/" + fileName;
            return imageUrl;
        } catch (IOException e){
            System.err.println("ERROR saving profile image: "+ e.getMessage());
            e.printStackTrace();
            throw new RuntimeException("Could not save profile image: " + fileName, e);
        }
    }
    public void deleteOldProfileImage(String imageUrl) {
        try {
            if (imageUrl != null && imageUrl.startsWith("/uploads/posts/")) {
                String fileName = imageUrl.substring("/uploads/posts/".length());
                java.nio.file.Path filePath = java.nio.file.Paths.get("uploads/posts/" + fileName);
                java.nio.file.Files.deleteIfExists(filePath);
                System.out.println("DEBUG: Deleted old profile image: " + fileName);
            }
        } catch (java.io.IOException e) {
            System.err.println("ERROR deleting old profile image: " + e.getMessage());
        }
    }


}
