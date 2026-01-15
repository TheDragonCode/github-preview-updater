import { reservedWords } from "../../src/libs/words";
import { titleCase } from "../../src/utils/strings";

test("words", () => {
    for (const word of reservedWords) {
        const lower = word.toLowerCase();
        const upper = word.toUpperCase();

        const items = [
            // Base
            `${word}_bar`,
            `foo ${word}-bar`,
            `foo ${word}_`,
            // Lower
            `${lower}_bar`,
            `foo ${lower}-bar`,
            `foo ${lower}_`,
            // Upper
            `${upper}_bar`,
            `foo ${upper}-bar`,
            `foo ${upper}_`,
        ];

        expect(items.map((item: string) => titleCase(item))).toMatchSnapshot();
    }
});

test("case", () => {
    expect(titleCase("fooBar")).toBe("Foo Bar");
    expect(titleCase("foo Bar")).toBe("Foo Bar");
    expect(titleCase("foo bar")).toBe("Foo Bar");
    expect(titleCase("FOO BAR")).toBe("Foo Bar");
    expect(titleCase("fOo bAr")).toBe("F Oo B Ar");

    expect(titleCase("foo-Bar")).toBe("Foo Bar");
    expect(titleCase("foo-bar")).toBe("Foo Bar");
    expect(titleCase("FOO-BAR")).toBe("Foo Bar");
    expect(titleCase("fOo-bAr")).toBe("F Oo B Ar");

    expect(titleCase("foo_Bar")).toBe("Foo Bar");
    expect(titleCase("foo_bar")).toBe("Foo Bar");
    expect(titleCase("FOO_BAR")).toBe("Foo Bar");
    expect(titleCase("fOo_bAr")).toBe("F Oo B Ar");

    expect(titleCase("foo/Bar")).toBe("Foo Bar");
    expect(titleCase("foo/bar")).toBe("Foo Bar");
    expect(titleCase("FOO/BAR")).toBe("Foo Bar");
    expect(titleCase("fOo/bAr")).toBe("F Oo B Ar");
});
