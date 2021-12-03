package com.example.test09.repository;

import com.example.test09.domain.Memo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface MemoRepository extends JpaRepository<Memo, Long> {

    @Query(
            "select m from Memo m " +
                    "join fetch m.tags t " +
                    "on t.tagName = :tagName"
    )
    List<Memo> findByTagName(String tagName);
}
