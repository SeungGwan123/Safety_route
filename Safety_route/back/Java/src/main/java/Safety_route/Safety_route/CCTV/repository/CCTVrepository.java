package Safety_route.Safety_route.CCTV.repository;

import Safety_route.Safety_route.CCTV.Model.CCTV;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface CCTVrepository extends JpaRepository<CCTV,Integer> {
    @Query(value = "select one.* from CCTV one , ( "
            +" SELECT ( 6371 * acos( cos( radians( :x ) ) * cos( radians( two.위도 ) ) * cos( radians( two.경도 ) - radians(:y) ) "
            +" + sin( radians( :x ) ) * sin( radians(two.위도) ) ) ) AS distance ,two.id "
            +" FROM CCTV two )Data "
            +" where Data.distance < 3 && one.id = Data.id ", nativeQuery = true)
    List<CCTV> searchCctv(@Param("y") double y,@Param("x") double x);
//    @Query(value = "select * from CCTV where CCTV.id<100", nativeQuery = true)
//    List<CCTV> searchCctv(@Param("x") double x,@Param("y") double y);
}
