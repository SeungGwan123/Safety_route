package Safety_route.Safety_route.CCTV.Model;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.Where;

@Builder
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "CCTV")
@Where(clause = "active_status = 'Y'")
public class CCTV {
    @Id
    @Column(name = "id")
    @JsonProperty("id")
    private int cctvId;

    @Column(name = "지역")
    @JsonProperty("Area")
    private String area;

    @Column(name = "도로명주소")
    @JsonProperty("new_address")
    private String newAddress;

    @Column(name = "지번주소")
    @JsonProperty("old_address")
    private String oldAddress;

    @Column(name = "설치목적")
    @JsonProperty("purpose")
    private String purpose;

    @Column(name = "갯수")
    @JsonProperty("number")
    private Integer number;

    @Column(name = "화소수")
    @JsonProperty("pixel")
    private Integer pixel;

    @Column(name = "촬영방면")
    @JsonProperty("recode_side")
    private String recodeSide;

    @Column(name = "보관일수")
    @JsonProperty("store_days")
    private Integer storeDays;

    @Column(name = "설치날짜")
    @JsonProperty("install_date")
    private String installDate;

    @Column(name = "전화번호")
    @JsonProperty("call")
    private String call;

    @Column(name = "위도")
    @JsonProperty("latitude")
    private Double latitude;

    @Column(name = "경도")
    @JsonProperty("equator")
    private Double equator;

    @Column(name = "업데이트날짜")
    @JsonProperty("recent_update")
    private String recentUpdate;
}
