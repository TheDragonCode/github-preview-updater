import { getReadme } from "../helpers/filesystem";

test("empty", () => expect(getReadme("empty.md")).toMatchSnapshot());
test("just-text", () => expect(getReadme("just-text.md")).toMatchSnapshot());
test("with-one-image", () =>
    expect(getReadme("with-one-image.md")).toMatchSnapshot());
test("with-one-image-without-header", () =>
    expect(getReadme("with-one-image-without-header.md")).toMatchSnapshot());
test("with-two-images", () =>
    expect(getReadme("with-two-images.md")).toMatchSnapshot());
test("with-two-images-without-header", () =>
    expect(getReadme("with-two-images-without-header.md")).toMatchSnapshot());
test("without-all", () =>
    expect(getReadme("without-all.md")).toMatchSnapshot());
test("without-images", () =>
    expect(getReadme("without-images.md")).toMatchSnapshot());
test("html-tag", () => expect(getReadme("html-tag.md")).toMatchSnapshot());
