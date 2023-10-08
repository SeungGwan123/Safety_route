package Safety_route.Safety_route.DTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
public class respDto<T> {
    private int code;
    private T data;
}
