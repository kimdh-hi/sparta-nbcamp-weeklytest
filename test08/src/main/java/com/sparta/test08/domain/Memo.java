package com.sparta.test08.domain;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;

@Entity
@NoArgsConstructor
@AllArgsConstructor
@Getter
public class Memo {

    @Id @GeneratedValue
    private Long id;

    @Column(nullable = false)
    private String contents;

    public Memo(String contents) {
        this.contents = contents;
    }
}
