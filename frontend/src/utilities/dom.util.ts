const DOMUtils = {
  wrapTextNodesWithSpanFromHTMLString(htmlString: string): string {
    // Bước 1: Phân tích cú pháp chuỗi HTML thành DOM
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlString, 'text/html');
    let idCounter = 1;

    function generateId(): string {
      return `storyhub-reading-position-${idCounter++}`;
    }

    // Bước 2: Hàm đệ quy để xử lý các text node
    function wrapTextNodesWithSpan(
      parentElement: HTMLElement | ChildNode
    ): void {
      const childNodes = Array.from(parentElement.childNodes);

      childNodes.forEach((node) => {
        if (
          node.nodeType === Node.TEXT_NODE &&
          node.textContent?.trim() !== ''
        ) {
          // Tạo thẻ span và bọc text node
          const span = doc.createElement('span');
          span.id = generateId();
          span.textContent = node.textContent;
          parentElement.replaceChild(span, node);
        } else if (node.nodeType === Node.ELEMENT_NODE) {
          if (!(node as HTMLElement).id) {
            (node as HTMLElement).id = generateId();
          }
          // Đệ quy xử lý các node con
          wrapTextNodesWithSpan(node as HTMLElement);
        }
      });
    }

    // Bước 3: Thực thi hàm trên phần body của tài liệu
    if (doc.body) {
      wrapTextNodesWithSpan(doc.body);
    }

    // Bước 4: Trả về kết quả là chuỗi HTML đã xử lý
    return doc.body?.innerHTML || '';
  },
};

export default DOMUtils;
