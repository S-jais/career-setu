package in.careersetu.ai;

import in.careersetu.ai.controller.AiProxyController;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.pdmodel.PDPage;
import org.apache.pdfbox.pdmodel.PDPageContentStream;
import org.apache.pdfbox.pdmodel.font.PDType1Font;
import org.apache.pdfbox.pdmodel.font.Standard14Fonts;
import org.junit.jupiter.api.Test;

import java.io.ByteArrayOutputStream;
import java.lang.reflect.Method;

import static org.junit.jupiter.api.Assertions.*;

public class PdfExtractionTest {

    @Test
    void testPdfTextExtractionWithPdfBox() throws Exception {
        // 1. Generate a real in-memory PDF with FlateDecode streams
        byte[] pdfBytes;
        try (PDDocument doc = new PDDocument()) {
            PDPage page = new PDPage();
            doc.addPage(page);

            try (PDPageContentStream cs = new PDPageContentStream(doc, page)) {
                cs.beginText();
                cs.setFont(new PDType1Font(Standard14Fonts.FontName.HELVETICA_BOLD), 14);
                cs.newLineAtOffset(100, 700);
                cs.showText("Aarav Sharma - Senior Software Engineer");
                cs.endText();

                cs.beginText();
                cs.setFont(new PDType1Font(Standard14Fonts.FontName.HELVETICA), 12);
                cs.newLineAtOffset(100, 680);
                cs.showText("Skills: Java, Spring Boot, React, Docker, PostgreSQL, Redis");
                cs.endText();
            }

            ByteArrayOutputStream baos = new ByteArrayOutputStream();
            doc.save(baos);
            pdfBytes = baos.toByteArray();
        }

        // 2. Invoke extractTextFromFile using reflection on AiProxyController
        AiProxyController controller = new AiProxyController("disabled");
        Method method = AiProxyController.class.getDeclaredMethod("extractTextFromFile", byte[].class, String.class);
        method.setAccessible(true);

        String extracted = (String) method.invoke(controller, pdfBytes, "Resume2.pdf");

        System.out.println("Extracted text from PDF:\n" + extracted);

        // 3. Verify clean extraction without raw PDF bytecode
        assertNotNull(extracted);
        assertTrue(extracted.contains("Aarav Sharma"), "Must contain extracted name");
        assertTrue(extracted.contains("Java, Spring Boot"), "Must contain technical skills");
        assertFalse(extracted.contains("FlateDecode"), "Must NOT contain raw PDF filter tokens");
        assertFalse(extracted.contains("StructTreeRoot"), "Must NOT contain PDF object structure tokens");
    }
}
