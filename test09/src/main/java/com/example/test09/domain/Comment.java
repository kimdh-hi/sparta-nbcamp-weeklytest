package com.example.test09.domain;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import javax.persistence.*;

@Entity
@Getter
@NoArgsConstructor
@AllArgsConstructor
public class Comment extends Timestamped{

    @Id
    @GeneratedValue
    private Long id;

    @Column(nullable = false)
    private String content;

    @JoinColumn(name = "memo_id")
    @ManyToOne(fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    private Memo memo;

    public void setMemo(Memo memo) {
        this.memo = memo;
    }

    public Comment(String content) {
        this.content = content;
    }
}
