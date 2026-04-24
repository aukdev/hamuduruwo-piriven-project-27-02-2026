package com.piriven.mcq.testimonial.util;

import javax.imageio.IIOImage;
import javax.imageio.ImageIO;
import javax.imageio.ImageWriteParam;
import javax.imageio.ImageWriter;
import javax.imageio.stream.ImageOutputStream;
import java.awt.*;
import java.awt.image.BufferedImage;
import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.Iterator;

public final class ImageOptimizer {

    private static final int TARGET_SIZE = 200;
    private static final float JPEG_QUALITY = 0.7f;
    private static final long MAX_INPUT_SIZE = 2 * 1024 * 1024; // 2MB

    private ImageOptimizer() {
    }

    public static byte[] optimizeProfilePhoto(byte[] inputData) throws IOException {
        if (inputData == null || inputData.length == 0) {
            throw new IllegalArgumentException("Image data is empty");
        }
        if (inputData.length > MAX_INPUT_SIZE) {
            throw new IllegalArgumentException("Image size exceeds maximum allowed 2MB");
        }

        BufferedImage original = ImageIO.read(new ByteArrayInputStream(inputData));
        if (original == null) {
            throw new IllegalArgumentException("Invalid image format");
        }

        // Center-crop to square
        int size = Math.min(original.getWidth(), original.getHeight());
        int x = (original.getWidth() - size) / 2;
        int y = (original.getHeight() - size) / 2;
        BufferedImage cropped = original.getSubimage(x, y, size, size);

        // Resize to target
        BufferedImage resized = new BufferedImage(TARGET_SIZE, TARGET_SIZE, BufferedImage.TYPE_INT_RGB);
        Graphics2D g2d = resized.createGraphics();
        g2d.setRenderingHint(RenderingHints.KEY_INTERPOLATION, RenderingHints.VALUE_INTERPOLATION_BILINEAR);
        g2d.setRenderingHint(RenderingHints.KEY_ANTIALIASING, RenderingHints.VALUE_ANTIALIAS_ON);
        g2d.setColor(Color.WHITE);
        g2d.fillRect(0, 0, TARGET_SIZE, TARGET_SIZE);
        g2d.drawImage(cropped, 0, 0, TARGET_SIZE, TARGET_SIZE, null);
        g2d.dispose();

        // Compress as JPEG
        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        Iterator<ImageWriter> writers = ImageIO.getImageWritersByFormatName("jpeg");
        if (!writers.hasNext()) {
            throw new IOException("No JPEG writer available");
        }
        ImageWriter writer = writers.next();
        try (ImageOutputStream ios = ImageIO.createImageOutputStream(baos)) {
            writer.setOutput(ios);
            ImageWriteParam param = writer.getDefaultWriteParam();
            param.setCompressionMode(ImageWriteParam.MODE_EXPLICIT);
            param.setCompressionQuality(JPEG_QUALITY);
            writer.write(null, new IIOImage(resized, null, null), param);
        } finally {
            writer.dispose();
        }

        return baos.toByteArray();
    }
}
