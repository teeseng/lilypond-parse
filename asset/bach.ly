\version "2.18.2"

\pointAndClickOff

\header {
  title = "Bist du bei mir"
  subtitle = \markup{\medium "from the lost opera" \italic "Diomedes, oder die triumphierende Unschuld" }
  composer = "Gottfried Heinrich Stölzel (1690-1749)"
  arranger = "Johann Sebastian Bach (1685-1750)"
  opus = "BWV 508"
  tagline = \markup {
    Engraved at
    \simple #(strftime "%Y-%m-%d" (localtime (current-time)))
    with \with-url #"http://lilypond.org/"
    \line { LilyPond \simple #(lilypond-version) (http://lilypond.org/) }
  }
}

global = {
  \override Staff.TimeSignature.style = #'single-digit
  \time 3/4
  \key es \major
}

right = \new Voice = "soprano" \relative c'' {
  \clef treble
  \autoBeamOff
  \repeat volta 2 {
    bes4 es4. f8
    d2 r4
    es as, as
    as2 g4
    r8 bes d [bes] a [bes]
    f bes d [bes] a [bes]
    es,4 c'4. (d16 [es])
    d8. c16 bes8. c16 f,8. a16
    bes2.
  }
  \mark \markup { \musicglyph #"scripts.segno" }
  es4 g8 [es] des [c]
  c2. 
  as'4 f4. es8
  d2\trill es4
  r8 es g [es] d [es]
  bes es g [es] d [es]
  as,4 f'4. (g16 [as])
  g8. f16 es8. f16 bes,8. d16
  es2.\fermata \bar "||"
  g4 es4. d8
  c2 r4
  f4 bes,4. c8
  a4 g8 [a] f4
  r8 c' es [c] b [c] 
  g c es [c] b [c]
  f,8 [e] f4 d'8. [es!32 f]
  es8. d16 c8. d16 g,8. b16
  c2.
  f,4 es'4. f8
  d2 r4
  es as, as 
  as2 g4
  r8 bes d [bes] a [bes]
  f bes d [bes] a [bes]
  es, [d] es4 c'8. [d32 es]
  d8. c16 bes8. c16 f,8. a16
  bes2. 
  \mark \markup { \musicglyph #"scripts.segno" } \bar "||"
}

left = \relative c {
  \clef bass
  \override Staff.RehearsalMark.direction = #'-1
  \repeat volta 2 {
    es4 c f
    bes, bes' as
    g f es
    d bes es,
    e e e
    f f f
    g a f
    bes es, f
    bes bes'8 as! g f
  }
  \mark \markup { \musicglyph #"scripts.segno" }
  g4 es g
  as2 g4
  f as f
  bes, b c
  a a a
  bes bes bes
  c d bes
  es as, bes
  es,_\markup{ { \bold{Fine.} }}\fermata g'8 f es d \bar "||"
  c4 c' c,
  f f, es
  d g es
  f2 r4
  fis fis fis
  g g g
  as'!2 as,4
  c es, g
  c c' bes!
  a2 f4 
  bes, bes' as!
  g f es
  d bes es,
  e e e 
  f f f
  g a f
  bes d, f 
  bes_\markup{ { \bold{Dal Segno al Fine.} }} bes' as!
  \bar "||"
  \mark \markup { \musicglyph #"scripts.segno" }
}

theLyrics = \new Lyrics \lyricsto "soprano" {
  Bist du bei mir, geh’ ich mit Freu -- den
  zum Ster -- ben und zu mei -- ner Ruh’,
  zum __ Ster -- ben und zu mei -- ner Ruh’.
  
  Bist du bei mir, geh’ ich mit Freu -- den
  zum Ster -- ben und zu mei -- ner Ruh’,
  zum __ Ster -- ben und zu mei -- ner Ruh’.
  
  Ach, wie ver -- gnügt wär’ so mein En -- _ de,
  es drück -- ten dei -- ne schö -- nen Hän -- de
  mir __ die ge -- treu -- en Au -- gen zu.
  
  Ach, wie ver -- gnügt wär’ so mein En -- de,
  es drück -- ten dei -- ne schö -- nen Hän -- de
  mir __ die ge -- treu -- en Au -- gen zu.
}

\score {
  \new StaffGroup = "piano" <<
    \new Staff = "rh" \with { 
      \override VerticalAxisGroup.staff-staff-spacing = #'((basic-distance . 12))
    } <<\global \right>>
    \theLyrics
    \new Staff = "lh" \with { 
      \consists "Mark_engraver" 
    } <<\global \left>> 
  >>
  
  \layout {
    \context {
      \Lyrics
      \consists "Bar_engraver"
      \consists "Separating_line_group_engraver"
      \hide BarLine
      \override VerticalAxisGroup.staff-affinity = #CENTER
    }
  }
  \midi {
    \tempo 4 = 60
  }
}
\paper {
  ragged-last-bottom = ##f
#(define fonts
  (make-pango-font-tree "Garamond"
                        "Nimbus Sans"
                        "Luxi Mono"
                        (/ staff-height pt 20)))
}