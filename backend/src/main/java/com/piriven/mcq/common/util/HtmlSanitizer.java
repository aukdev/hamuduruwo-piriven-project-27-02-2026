package com.piriven.mcq.common.util;

import org.owasp.html.HtmlPolicyBuilder;
import org.owasp.html.PolicyFactory;

public final class HtmlSanitizer {

    private static final PolicyFactory POLICY = new HtmlPolicyBuilder()
            // Formatting
            .allowElements("p", "b", "strong", "i", "em", "u", "s", "br")
            // Headings
            .allowElements("h1", "h2", "h3", "h4", "h5", "h6")
            // Lists
            .allowElements("ul", "ol", "li")
            // Block
            .allowElements("blockquote", "pre", "code")
            // Span with limited styles
            .allowElements("span")
            .allowAttributes("style").onElements("span")
            .allowStyling()
            // Links
            .allowElements("a")
            .allowAttributes("href").onElements("a")
            .allowUrlProtocols("http", "https")
            .requireRelNofollowOnLinks()
            .toFactory();

    private HtmlSanitizer() {
    }

    public static String sanitize(String html) {
        if (html == null || html.isBlank()) {
            return html;
        }
        return POLICY.sanitize(html);
    }
}
