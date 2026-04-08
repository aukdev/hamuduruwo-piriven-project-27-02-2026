package com.piriven.mcq.testimonial.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.Size;

public record UpdateTestimonialRequest(
        @Size(max = 1000, message = "අදහස අකුරු 1000 ට වඩා අඩු විය යුතුය") String quote,

        @Size(max = 200, message = "තනතුර අකුරු 200 ට වඩා අඩු විය යුතුය") String positionTitle,

        @Min(value = 1, message = "අගය 1 ට වැඩි විය යුතුය") @Max(value = 5, message = "අගය 5 ට අඩු විය යුතුය") Integer rating,

        Boolean isPublished) {
}
