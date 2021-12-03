package com.example.test09.domain;

import lombok.Generated;
import lombok.Getter;
import lombok.NoArgsConstructor;

import javax.persistence.*;

@Entity
@NoArgsConstructor
@Getter
public class Tag {

    @Id @GeneratedValue
    private Long id;

    private String tagName;

    @JoinColumn(name = "memo_id")
    @ManyToOne(fetch = FetchType.LAZY)
    private Memo memo;

    public void setMemo(Memo memo) {
        this.memo = memo;
    }

    public Tag(String tagName) {

        this.tagName = tagName;
    }
}
